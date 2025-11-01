export const parseObject = (obj) => {
  if (!obj) return null;

  return {
    drone_id: obj.drone_id,
    drone_name: obj.drone_name,
    condition: obj.condition,
    light: obj.light,
    weight: obj.weight,
    country: obj.country,
    population: obj.population,
  };
};

export const parseLogObject = (obj) => {
  if (!obj) return null;

  return {
    drone_id: obj.drone_id,
    drone_name: obj.drone_name,
    created: obj.created,
    country: obj.country,
    celsius: obj.celsius,
  };
};
