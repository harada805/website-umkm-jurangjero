import { redirect } from "next/navigation";

export default function InternalPanelAlias() {
  redirect("/admin/login");
}
