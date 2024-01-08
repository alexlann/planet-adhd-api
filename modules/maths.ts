export const getFirstLastDatesFromMonth = (month: string) => {
    const yearNumber = new Date(month).getFullYear();
    const monthNumber = new Date(month).getMonth();
    const monthFirstDate = 1;
    const monthLastDate = new Date(yearNumber, monthNumber+1, 0).getDate();

    const monthFirst = new Date(yearNumber, monthNumber, monthFirstDate+1);
    const monthLast = new Date(yearNumber, monthNumber, monthLastDate+1);
    
    return { monthFirst, monthLast };
}