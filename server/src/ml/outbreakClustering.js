import { DBSCAN } from "density-clustering";

export function detectClusters(points, { epsilonKm = 2, minPoints = 3 } = {}) {
  if (points.length < minPoints) return [];

  const dataset = points.map((p) => [p.lat, p.lng]);
  const epsilon = epsilonKm / 111;

  const dbscan = new DBSCAN();
  const clusters = dbscan.run(dataset, epsilon, minPoints);

  return clusters.map((clusterIndices) => ({
    size: clusterIndices.length,
    points: clusterIndices.map((i) => points[i]),
    center: {
      lat: clusterIndices.reduce((sum, i) => sum + points[i].lat, 0) / clusterIndices.length,
      lng: clusterIndices.reduce((sum, i) => sum + points[i].lng, 0) / clusterIndices.length,
    },
  }));
}