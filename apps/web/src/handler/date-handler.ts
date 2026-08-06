export const formatDate = (date: string | Date): string => {
  if(date){
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }
  else{
    return '';
  }
};
