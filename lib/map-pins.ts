import type { HistoricalEntity, Locale } from '@/types/history';
/** City names include the country, so identically named cities in different countries stay separate. */
export function groupMapCities(entities: readonly HistoricalEntity[]) {
  const groups = new Map<
    string,
    {
      key: string;
      name: string;
      lat: number;
      lon: number;
      count: number;
      entities: HistoricalEntity[];
      institutions: string[];
    }
  >();
  for (const entity of entities)
    for (const location of entity.locations) {
      const key = location.name.trim().toLocaleLowerCase('en').replace(/\s+/g, ' ');
      const city = groups.get(key) ?? {
        key,
        name: location.name,
        lat: 0,
        lon: 0,
        count: 0,
        entities: [],
        institutions: [],
      };
      city.lat += location.lat;
      city.lon += location.lon;
      city.count++;
      if (!city.entities.some((e) => e.id === entity.id)) city.entities.push(entity);
      if (!city.institutions.includes(location.institution))
        city.institutions.push(location.institution);
      groups.set(key, city);
    }
  return [...groups.values()]
    .map((city) => ({ ...city, lat: city.lat / city.count, lon: city.lon / city.count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

export type MapCity = ReturnType<typeof groupMapCities>[number];
export type MapCluster = {
  key: string;
  x: number;
  y: number;
  cities: MapCity[];
  entities: HistoricalEntity[];
};
/** Merge overlapping screen-space marker footprints without losing city or idea membership. */
export function clusterMapCities(
  cities: MapCity[],
  project: (lon: number, lat: number) => [number, number],
  distance: number,
): MapCluster[] {
  const groups = cities.map((city) => {
    const [x, y] = project(city.lon, city.lat);
    return { x, y, cities: [city] };
  });
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < groups.length; i++)
      for (let j = i + 1; j < groups.length; j++) {
        if (Math.hypot(groups[i].x - groups[j].x, groups[i].y - groups[j].y) >= distance) continue;
        const members = [...groups[i].cities, ...groups[j].cities];
        const points = members.map((city) => project(city.lon, city.lat));
        groups[i] = {
          cities: members,
          x: points.reduce((sum, p) => sum + p[0], 0) / points.length,
          y: points.reduce((sum, p) => sum + p[1], 0) / points.length,
        };
        groups.splice(j, 1);
        merged = true;
        break outer;
      }
  }
  return groups.map((group) => ({
    ...group,
    key: group.cities
      .map((city) => city.key)
      .sort()
      .join('|'),
    entities: [
      ...new Map(
        group.cities.flatMap((city) => city.entities).map((entity) => [entity.id, entity]),
      ).values(),
    ],
  }));
}

/** Shared count summary for visual and accessible cluster descriptions. */
export function describeMapCluster(cluster: MapCluster, locale: Locale) {
  const cities = cluster.cities.length;
  const discoveries = cluster.entities.length;
  const labels = {
    en: [cities === 1 ? 'city' : 'cities', discoveries === 1 ? 'discovery' : 'discoveries'],
    de: [cities === 1 ? 'Stadt' : 'Städte', discoveries === 1 ? 'Entdeckung' : 'Entdeckungen'],
    es: [
      cities === 1 ? 'ciudad' : 'ciudades',
      discoveries === 1 ? 'descubrimiento' : 'descubrimientos',
    ],
  }[locale];
  return `${cities} ${labels[0]} · ${discoveries} ${labels[1]}`;
}
