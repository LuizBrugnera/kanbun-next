import GroupDetails from "@/components/GroupDetails";
import Navbar from "@/components/Navbar";
import { Fragment } from "react";

export default function GroupDetailsPage({ params }: any) {
  const returnDetails = async () => {
    const awaitParams = await params;
    return <GroupDetails id={+awaitParams.id} />;
  };
  return (
    <Fragment>
      <Navbar />
      <main>{returnDetails()}</main>
    </Fragment>
  );
}
