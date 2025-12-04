
import Header from "@/components/Header";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage({params}) {
  const {id} = await params;

  if (id) return (
    <ProfileClient id={id}/>
  );
}
