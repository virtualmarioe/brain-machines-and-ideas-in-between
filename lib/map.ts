import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import land from '@/public/diagrams/world-land.json';
import type { Feature, MultiPolygon } from 'geojson';
const topology = land as unknown as Topology<{ land: GeometryCollection }>;
const original = feature(topology, topology.objects.land);
/** Omit Antarctic polygons before fitting, rather than merely hiding their fill. */
export const geography: Feature<MultiPolygon> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'MultiPolygon',
    coordinates: original.features.flatMap(({ geometry }) => {
      const polygons =
        geometry.type === 'MultiPolygon'
          ? geometry.coordinates
          : geometry.type === 'Polygon'
            ? [geometry.coordinates]
            : [];
      return polygons.filter((polygon) => polygon[0].some(([, latitude]) => latitude > -60));
    }),
  },
};
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
