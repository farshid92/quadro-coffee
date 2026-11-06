// Facts that are the same in every language. Source: brief.md
export const business = {
  name: 'Quadro Coffee',
  phone: '+905488897321',
  phoneDisplay: '0548 889 73 21',
  // TODO: confirm the WhatsApp number with the owner (assumed same as phone)
  whatsapp: '905488897321',
  street: 'Memduh Asaf Sokak No 15/C',
  district: 'Köşklüçiftlik',
  city: 'Lefkoşa',
  postalCode: '1010',
  geo: { lat: 35.1819074, lng: 33.3553297 },
  mapsUrl: 'https://maps.app.goo.gl/spCPvxSG7Ei5YEj2A',
  instagram: 'https://www.instagram.com/quadrocyprus/',
  // TODO: add the Facebook page URL
  facebook: '',
  // schema.org opening hours (from Google, confirm with owner)
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Thursday'], opens: '07:30', closes: '23:00' },
    { days: ['Wednesday', 'Friday', 'Saturday'], opens: '07:30', closes: '23:30' },
    { days: ['Sunday'], opens: '09:00', closes: '23:00' },
  ],
};
