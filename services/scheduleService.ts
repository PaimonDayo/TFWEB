
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
            } else if (char === ',') {
                currentRow.push(currentFieldChars.join('')); // Removed .trim()
                currentFieldChars = [];
            } else if (char === '\n') {
                currentRow.push(currentFieldChars.join('')); // Removed .trim()
                currentFieldChars = [];
                if (currentRow.some(field => field.trim() !== '')) { // Trim here for row empty check
                    rows.push([...currentRow]);
                }
                currentRow = [];
            } else {
                currentFieldChars.push(char);
            }
        }
    }

    // Handle the last field of the last line
    if (currentFieldChars.length > 0 || (currentRow.length > 0 && text[text.length - 1] === ',')) {
         currentRow.push(currentFieldChars.join('')); // Removed .trim()
    }
    
    // Push the last row if it has content
    if (currentRow.some(field => field.trim() !== '')) { // Trim here for row empty check
        rows.push([...currentRow]);
    }
    
    return rows;
}


async function tryFetchSheet(spreadsheetId: string, sheetName: string): Promise<string | null> {
  // Add a cache-busting parameter using the current timestamp
  const timestamp = new Date().getTime();
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&_${timestamp}`;
  
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

  if (allRecords.length === 0 || (allRecords.length === 1 && allRecords[0].every(col => col.trim() === ''))) { 
    return []; 
  }
  
  const scheduleItems: ScheduleItem[] = [];
  // Determine if the first row is a header or data by checking if it contains non-empty, non-whitespace cells
  const firstRowIsLikelyHeader = allRecords.length > 0 && allRecords[0].some(cell => cell.trim() !== ''); // Basic check
  const dataStartIndex = firstRowIsLikelyHeader ? 1 : 0;


  for (let i = dataStartIndex; i < allRecords.length; i++) { 
    const columns = allRecords[i];
     if (columns.length === 0 || columns.every(col => col.trim() === '')) { // Skip completely empty or whitespace-only rows
        continue;
    }

    const dateStrRaw = (columns[0] ?? '').trim();
    if (!dateStrRaw) {
        continue;
    }

    let day: number | null = null;
    let cellMonth: number | null = null;

    if (dateStrRaw.includes('/')) {
      const parts = dateStrRaw.split('/');
      if (parts.length === 2) {
        cellMonth = parseInt(parts[0], 10);
        day = parseInt(parts[1], 10);
      }
    } else if (dateStrRaw.includes('月') && dateStrRaw.includes('日')) {
      const match = dateStrRaw.match(/(\d+)月\s*(\d+)日/);
      if (match) {
        cellMonth = parseInt(match[1], 10);
        day = parseInt(match[2], 10);
      }
    } else {
      const dayNum = parseInt(dateStrRaw, 10);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
        day = dayNum;
        cellMonth = month; // Assume current sheet's month if only day number is present
      }
    }
    
    if (day === null || isNaN(day) || day < 1 || day > 31 ||
        cellMonth === null || isNaN(cellMonth) || cellMonth < 1 || cellMonth > 12) {
      continue;
    }

    if (cellMonth !== month) {
      continue;
    }

    const dateKey = new Date(year, month - 1, day).getTime();
    if (isNaN(dateKey)) {
        continue;
    }

    const dayOfWeekVal = (columns[1] ?? '').trim();
    // For timeFromSheet, use raw value from CSV (no trim here)
    const timeFromSheet = columns[2] ?? ''; 
    const locationVal = (columns[3] ?? '').trim();
    const menuVal = (columns[4] ?? '').trim(); 
    const paceVal = (columns[5] ?? '').trim();
    const strengtheningVal = (columns[6] ?? '').trim();
    const notesVal = (columns[7] ?? '').trim();
    
    // Skip row if essential identifying info (location or menu) is missing, 
    // unless time itself has content (e.g., "調整" or "大会").
    // An empty time string from sheet is acceptable if other fields have data.
    if (timeFromSheet.trim() === '' && locationVal === '' && menuVal === '') {
        continue;
    }

    scheduleItems.push({
      id: `${dateKey}-${i}`,
      day: day,
      dateStr: `${month}/${day}`,
      dayOfWeek: dayOfWeekVal,
      time: timeFromSheet, // Use raw value for time
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
