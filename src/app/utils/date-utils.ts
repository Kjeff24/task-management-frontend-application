import { DatePipe } from '@angular/common';

export function convertDateToISOFormat(backendDate: string, datePipe: DatePipe): string | null {

  if (backendDate) {
    const dateParts = backendDate.split(' ');
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    const time = dateParts[3];

    const months: { [key: string]: string } = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    const monthNumber = months[month];

    const dateString = `${year}-${monthNumber}-${day}T${time}:00`;

    return datePipe.transform(new Date(dateString), 'yyyy-MM-ddTHH:mm')!;
  }
  return null;
}
