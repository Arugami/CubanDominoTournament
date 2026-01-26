export type TournamentEvent = {
  id: string;
  name: string;
  dateISO: string;
  dayOfWeek: string;
  dateLong: string;
  dateMonthDay: string;
  shortDate: string;
  doorsOpenAt: string;
  firstSlamAt: string;
  doorsOpenLabel: string;
  callTimeLabel: string;
  venueName: string;
  venueAddress: string;
  venueCityState: string;
  venueMapUrl: string;
};

export const TOURNAMENT_I: TournamentEvent = {
  id: "cdl-1",
  name: "Cuban Domino League — Tournament I",
  dateISO: "2026-01-31",
  dayOfWeek: "Saturday",
  dateLong: "January 31, 2026",
  dateMonthDay: "January 31",
  shortDate: "Jan 31",
  doorsOpenAt: "2026-01-31T18:00:00-05:00",
  firstSlamAt: "2026-01-31T19:00:00-05:00",
  doorsOpenLabel: "Doors open at 6PM",
  callTimeLabel: "Saturday, Jan 31 @ 7:00 PM",
  venueName: "Stefan's Lounge",
  venueAddress: "333 Bergenline Blvd",
  venueCityState: "Fairview, NJ",
  venueMapUrl: "https://maps.google.com/?q=333+Bergenline+Blvd,+Fairview,+NJ",
};
