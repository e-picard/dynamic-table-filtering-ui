import type { Route } from "./+types/filter-tables";
import { tableOfCsv } from "lib/tableOfCsv";
import { people100Csv } from "./people100Csv.js";
import { productsData } from "./productsData.js";
import { eventsData } from "./eventsData.js";
import { booksData } from "./booksData.js";
import { companiesData } from "./companiesData.js";
import { ControlPanel } from "~/ControlPanel/ControlPanel.js";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dynamic Multi-Table Search" },
    { name: "description", content: "Search and filter across multiple data tables" },
  ];
}


const tables = {
  people: tableOfCsv(
    "Index",
    [
      "Index",
      "User Id",
      "First Name",
      "Last Name",
      "Sex",
      "Email",
      "Phone",
      "Date of birth",
      "Job Title"
    ] as const, people100Csv),
  products: tableOfCsv(
    "id",
    [
      "id",
      "name",
      "category",
      "price",
      "stock",
      "brand",
      "rating"
    ] as const, productsData),
  events: tableOfCsv(
    "id",
    [
      "id",
      "title",
      "category",
      "date",
      "location",
      "attendees",
      "price",
      "organizer"
    ] as const, eventsData),
  books: tableOfCsv(
    "id",
    [
      "id",
      "title",
      "author",
      "genre",
      "year",
      "pages",
      "rating",
      "publisher"
    ] as const, booksData),
  companies: tableOfCsv(
    "id",
    [
      "id",
      "name",
      "industry",
      "employees",
      "revenue",
      "founded",
      "country",
      "ceo"
    ] as const, companiesData)
};

export default function FilterTables() {
  return <div className="h-screen w-full">
    <ControlPanel tables={tables} />
  </div>
}
