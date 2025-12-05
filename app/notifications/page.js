"use client";

import Header from "@/components/Header";
import NotificationsList from "@/components/NotificationsList";

export default function NotificationsPage() {
  return (
    <>
    <Header />
    <NotificationsList idUser={1} />
    </>
  );
}