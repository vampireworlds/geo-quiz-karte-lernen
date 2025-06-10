
import React from "react";
import { SimpleMap } from "./SimpleMap";

interface MapContainerProps {
  mapboxToken?: string;
}

export const MapContainer = ({ mapboxToken }: MapContainerProps) => {
  return <SimpleMap />;
};
