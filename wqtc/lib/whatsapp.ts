export function formatWhatsAppLink(phoneNumber: string, message: string) {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  }
  
  export function getDefaultRegistrationMessage(registration: any) {
    return `
  Assalamu Alaikum,
  
  I would like to register for the WQTC Ladies Class:
  
  Language: ${registration.language}
  Timing: ${registration.timing}
  Days: ${registration.days}
  Class Type: ${registration.classType}
  
  My Details:
  Name: ${registration.name}
  Email: ${registration.email}
  Country: ${registration.country}
  
  ${registration.additionalNotes ? `Additional Notes: ${registration.additionalNotes}` : ''}
  
  Jazakallah Khair!
    `.trim();
  }
  