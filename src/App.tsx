import { BrowserRouter, Routes, Route } from "react-router-dom";
import VotingDemo1 from "./pages/VotingDemo1";
import VotingDemo2 from "./pages/VotingDemo2";

import "./App.css";
import { EventTime, Location, Person } from "./newtypes/voting";

const SAMPLE_PEOPLE: Person[] = [
  {
    profileColor: "#CB2FCE",
    name: "Hashimoto",
  },
  {
    profileColor: "#F4AD5A",
    name: "Varun",
  },
  {
    profileColor: "#FCFF81",
    name: "Paige",
  },
  {
    profileColor: "#3DE24E",
    name: "Jeffrey",
  },
];

function makeDateRelativeToToday(
  plusToday: number,
  hour: number,
  minute: number
): Date {
  // Return a new Date that is equal to
  // the current date plus the number of days,
  // and is at hour:minute for the time.
  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + plusToday,
    hour,
    minute
  );
  return date;
}

const SAMPLE_LOCATIONS: Location[] = [
  {
    name: "Owens Field Skate Park",
    yelpUrl: "https://www.yelp.com/biz/owens-field-park-columbia",
    stars: 4.7,
    distanceFromCurrentUser: 7,
    previewImageUrl:
      "https://cdn.discordapp.com/attachments/447198085916131349/952016215293980672/AF1QipOGiZvLm4CPj3j_AP08VnAaXT68_Wqb3BqfX03os1600-w400.png",
    address: "1351 Jim Hamilton Blvd, Columbia, SC 29205",
  },
  {
    name: "Beltline Lanes",
    yelpUrl: "https://www.yelp.com/biz/beltline-lanes-and-gaming-columbia",
    stars: 4.5,
    distanceFromCurrentUser: 13,
    previewImageUrl:
      "https://cdn.discordapp.com/attachments/447198085916131349/952016684217151539/unknown.png",
    address: "2154 S Beltline Blvd, Columbia, SC 29201",
  },
  {
    name: "Blossom Buffet",
    yelpUrl: "https://www.yelp.com/biz/blossom-buffet-west-columbia",
    stars: 4.5,
    distanceFromCurrentUser: 15,
    previewImageUrl:
      "https://cdn.discordapp.com/attachments/447198085916131349/952017139127169054/o.png",
    address: "2515 Sunset Blvd West Columbia, SC 29169",
  },
  {
    name: "Massage Therapy by Trudie Harris",
    yelpUrl:
      "https://www.yelp.com/biz/a-therapeutic-massage-by-trudie-harris-columbia",
    stars: 5.0,
    distanceFromCurrentUser: 19,
    previewImageUrl:
      "https://cdn.discordapp.com/attachments/447198085916131349/952017148123971625/tllshxwhysbxpsfy.png",
    address: "232 Skyland Dr, Columbia, SC 29210",
  },
];

const SAMPLE_DATA: EventTime[] = [
  {
    start: makeDateRelativeToToday(1, 20, 0), // 1 day from now, 8:00 PM
    end: makeDateRelativeToToday(1, 21, 0), // 1 day from now, 9:00 PM
    available: [
      SAMPLE_PEOPLE[0],
      SAMPLE_PEOPLE[1],
      SAMPLE_PEOPLE[2],
      SAMPLE_PEOPLE[3],
    ],
    bestLocations: [SAMPLE_LOCATIONS[0]],
  },
  {
    start: makeDateRelativeToToday(2, 19, 0), // 2 days from now, 7:00 PM
    end: makeDateRelativeToToday(2, 20, 0), // 2 days from now, 8:00 PM
    available: [SAMPLE_PEOPLE[0], SAMPLE_PEOPLE[1], SAMPLE_PEOPLE[3]],
    bestLocations: [SAMPLE_LOCATIONS[1], SAMPLE_LOCATIONS[2]],
  },
  {
    start: makeDateRelativeToToday(3, 17, 0), // 3 days from now, 5:00 PM
    end: makeDateRelativeToToday(3, 18, 0), // 3 days from now, 6:00 PM
    available: [SAMPLE_PEOPLE[1], SAMPLE_PEOPLE[2]],
    bestLocations: [SAMPLE_LOCATIONS[0], SAMPLE_LOCATIONS[3]],
  },
];

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/demo/voting/1"
            element={<VotingDemo1 data={SAMPLE_DATA} />}
          />
          <Route
            path="/demo/voting/2"
            element={<VotingDemo2 data={SAMPLE_DATA} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
