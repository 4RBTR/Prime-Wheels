import { getCookie } from "@/helper/cookies";
import AddCustomerForm from "./form";

export default async function AdminCustomerPage() {
  const services = await 
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/services?page=1&quantity=1000`,{
    method: "GET",
    headers: {
      "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
      authorization: `Bearer ${await getCookie("token")}`,
    },
  });
  const servicesData = await services.json();
  console.log(servicesData);
  return (
    <div className="w-full p-5">
      <h1 className="text-2xl font-bold">
        Add New Customer
      </h1>
      <p className="text-slate-500">
        This page is to add a new Customer.
      </p>
      <AddCustomerForm serviceList={servicesData.data}/>
    </div>
  );
}
