"use client";
import { Card } from "flowbite-react";
import CarouselImage from "./carouselImage/carouselImage"; // Adjusted component name and path
import Agent from "../agent/page";
import Servicelists from "../services/servicelists";
import ContactAgentForm from "../contactAgentForm/AgentForm";
import HighlightedProduct from "../product/hotlistproduct/page";
import ProductsByPrice from "../product/productByPrice/productByPrice"; // Adjusted component name and path
import Search from "../search/search";

const Dashboard = () => {
  return (
    <div style={{ backgroundColor: "#14222d" }}>
      <div>
        <CarouselImage />
      </div>
      <div>
        <Search />
      </div>
      <div className="-my-14">
        <Servicelists />
      </div>
      <HighlightedProduct />

      {/* <ProductCount /> */}
      <div className="">
        <ProductsByPrice />
      </div>
      <div className="">
        <Agent />
      </div>
      {/* <div className="pt-1 m-4 md:m-20">
        <Card className="max-w-full">
          <ContactAgentForm />
        </Card>
      </div> */}
    </div>
  );
};

export default Dashboard;
