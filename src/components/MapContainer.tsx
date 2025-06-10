
import React from "react";
import { InteractiveMap } from "./InteractiveMap";

interface MapContainerProps {
  mapboxToken?: string;
}

export const MapContainer = ({ mapboxToken }: MapContainerProps) => {
  return <InteractiveMap />;
};
