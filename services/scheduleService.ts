
import { ScheduleItem } from '../types';

// New CSV parser
// Handles quoted fields, newlines within quoted fields, and escaped quotes ("").
function parseCsv(csvText: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentFieldChars: string[] = [];
    let inQuotes = false;

    // Normalize line endings to \n for simpler parsing
    const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (inQuotes) {
            if (char === '"') {
                // Check for escaped double quote
                if (i + 1 < text.length && text[i + 1] === '"') {
                    currentFieldChars.push('"');
                    i++; // Increment to skip the second quote of the pair
                } else {
                    inQuotes = false; // End of quoted field
                }
            } else {
                currentFieldChars.push(char); // Character inside a quoted field
            }
        } else { // Not in quotes
            if (char === '"') {
                inQuotes = true;
                // If currentFieldChars is not empty here, it implies a quote appeared mid-field.
                // Standard CSV expects quotes to either start a quoted field or be escaped within one.
                // We assume that if a quote is encountered, it's the start of a new quoted field.
                // Any preceding unquoted content for this field should ideally not exist if this quote is structural.
                // However, this parser will include it if `currentFieldChars` wasn't cleared by a preceding comma/newline.
                // For typical Google Sheets output, `currentFieldChars` should be empty here.
            } else if (char === ',') {
                currentRow.push(currentFieldChars.join('').trim());
                currentFieldChars = [];
            } else if (char === '\n') {
                currentRow.push(currentFieldChars.join('').trim());
                currentFieldChars = [];
                // Add row only if it contains non-empty strings after trimming
                if (currentRow.some(field => field !== '')) {
                    rows.push([...currentRow]);
                }
                currentRow = [];
            } else {
                currentFieldChars.push(char);
            }
        }
    }

    // Add the last field
    if (currentFieldChars.length > 0 || text[text.length - 1] === ',' || text[text.length -1] === '\n') {
         // The condition `text[text.length - 1] === ','` ensures an empty field after a trailing comma is added.
         // `text[text.length-1] === '\n'` ensures an empty field from a trailing newline on an empty line is considered (though row filtering handles empty rows).
        currentRow.push(currentFieldChars.join('').trim());
    }

    // Add the last row if it has content
    if (currentRow.some(field => field !== '')) {
        rows.push([...currentRow]);
    }
    
    return rows;
}


async function tryFetchSheet(spreadsheetId: string, sheetName: string): Promise<string | null> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  
  try {
    const timeoutPromise = new Promise<Response>((_, reject) => 
      setTimeout(() => reject(new Error('Data fetch timed out after 10 seconds')), 10000)
    );

    const response = await Promise.race([fetch(url), timeoutPromise]);

    if (!response.ok) {
      return null;
    }
    const text = await response.text();

    if (text.includes('<!DOCTYPE html>') || text.includes('google.visualization.Query.setResponse') || (text.toLowerCase().includes('error') && text.toLowerCase().includes('not found'))) {
      return null;
    }
    return text;
  } catch (error) {
    return null;
  }
}

export async function fetchAndParseSheetData(spreadsheetId: string, month: number, year: number): Promise<ScheduleItem[]> {
  const possibleSheetNames = [
    `${month}月メニュー`,
    month < 10 ? `0${month}月メニュー` : null 
  ].filter(Boolean) as string[];

  let csvText: string | null = null;
  for (const sheetName of possibleSheetNames) {
    csvText = await tryFetchSheet(spreadsheetId, sheetName);
    if (csvText) break;
  }

  if (!csvText) {
    throw new Error(`${month}月の練習データが見つかりませんでした。シート名を確認してください。 (試行: ${possibleSheetNames.join(', ')})`);
  }

  const allRecords = parseCsv(csvText);

  if (allRecords.length <= 1 && (allRecords.length === 0 || allRecords[0].every(col => col === ''))) { 
    // No data if allRecords is empty, or only has one row that is entirely empty strings (e.g. empty sheet or only headers cleared)
    return []; 
  }
  
  const scheduleItems: ScheduleItem[] = [];
  // Assuming the first row (if present and not empty) is headers, data starts from index 1.
  // If allRecords[0] is data (e.g. CSV has no headers), this will skip it.
  // A more robust approach might be to check if allRecords[0] looks like data or header.
  // For now, assume if allRecords.length > 0, allRecords[0] could be header or data.
  // The loop should start from 0 if there are no headers, or 1 if there are.
  // Let's assume there's always a header row to be skipped if data exists.
  const dataStartIndex = (allRecords.length > 0 && allRecords[0].join('').length > 0) ? 1 : 0;


  for (let i = dataStartIndex; i < allRecords.length; i++) { 
    const columns = allRecords[i];

    const dateStrRaw = columns[0] ?? '';
    if (!dateStrRaw) {
        continue;
    }

    let day: number | null = null;
    if (dateStrRaw.includes('/')) {
      const parts = dateStrRaw.split('/');
      if (parts.length === 2) day = parseInt(parts[1], 10);
    } else if (dateStrRaw.includes('月')) {
      const match = dateStrRaw.match(/(\d+)月\s*(\d+)日/);
      if (match) day = parseInt(match[2], 10);
    } else {
      const dayNum = parseInt(dateStrRaw, 10);
      if (!isNaN(dayNum) && dayNum >=1 && dayNum <=31) day = dayNum; // Ensure day is valid if just a number
    }
    
    if (day === null || isNaN(day) || day < 1 || day > 31) {
      continue;
    }

    const dateKey = new Date(year, month - 1, day).getTime();
    if (isNaN(dateKey)) {
        continue;
    }

    const dayOfWeekVal = columns[1] ?? '';
    const timeVal = columns[2] ?? '';
    const locationVal = columns[3] ?? '';
    const menuVal = columns[4] ?? ''; 
    const paceVal = columns[5] ?? '';
    const strengtheningVal = columns[6] ?? '';
    const notesVal = columns[7] ?? '';
    
    if (timeVal === '' && locationVal === '' && menuVal === '') {
        continue;
    }

    scheduleItems.push({
      id: `${dateKey}-${i}`,
      day: day,
      dateStr: `${month}/${day}`,
      dayOfWeek: dayOfWeekVal,
      time: timeVal.length > 0 ? timeVal : '情報なし', 
      location: locationVal.length > 0 ? locationVal : '情報なし', 
      menu: menuVal.length > 0 ? menuVal : '情報なし', 
      pace: paceVal.length > 0 ? paceVal : '情報なし', 
      strengthening: strengtheningVal.length > 0 ? strengtheningVal : '情報なし', 
      notes: notesVal.length > 0 ? notesVal : '情報なし', 
      dateKey: dateKey,
    });
  }
  return scheduleItems;
}
