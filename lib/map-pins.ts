import type { HistoricalEntity } from '@/types/history';
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
