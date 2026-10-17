import type { Metadata } from "next";
import { CalendarGrid } from "@/features/calendar/calendar-grid";
export const metadata: Metadata = { title: "Calendar" };
export default function CalendarPage() { return <CalendarGrid />; }
