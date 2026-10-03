import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import land from '@/public/diagrams/world-land.json';
const topology = land as unknown as Topology<{ land: GeometryCollection }>;
const geography = feature(topology, topology.objects.land);
const projection = geoNaturalEarth1().fitExtent(
  [
    [8, 8],
    [712, 285],
  ],
  geography,
);
export function project(lon: number, lat: number): [number, number] {
  return projection([lon, lat]) ?? [360, 147];
}
export const landPath = geoPath(projection)(geography) ?? '';
