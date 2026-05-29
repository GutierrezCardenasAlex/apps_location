import { useCallback, useMemo, useState } from "react";
import MapView from "./components/MapView";
import SearchPanel from "./components/SearchPanel";
import LocationButton from "./components/LocationButton";
import ZoomControls from "./components/ZoomControls";
import ThreeDButton from "./components/ThreeDButton";
import RouteSummary from "./components/RouteSummary";
import { getCurrentLocation } from "./services/geolocation.service";
import { getRoute } from "./services/route.service";
import type { Coordinate, RouteResult, SelectionMode, TransportMode } from "./types/maps";

const initialCenter: Coordinate = { lng: -65.7531, lat: -19.5836 };

export default function App() {
  const [origin, setOrigin] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("none");
  const [transportMode, setTransportMode] = useState<TransportMode>("car");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [toast, setToast] = useState("Mapa cargado correctamente.");
  const [isRouting, setIsRouting] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [mapActions, setMapActions] = useState<{
    zoomIn: () => void;
    zoomOut: () => void;
    centerOn: (coordinate: Coordinate, zoom?: number) => void;
    fitRoute: () => void;
    set3D: (enabled: boolean) => void;
  } | null>(null);

  const canCalculate = Boolean(origin && destination);

  const calculateRoute = useCallback(
    async (nextMode = transportMode) => {
      if (!origin) {
        setToast("Selecciona un punto de origen.");
        return;
      }

      if (!destination) {
        setToast("Selecciona un punto de destino.");
        return;
      }

      setIsRouting(true);
      setToast("Calculando ruta...");

      try {
        const result = await getRoute(origin, destination, nextMode);
        setRoute(result);
        setToast("Ruta recomendada lista.");
      } catch (error) {
        setToast(error instanceof Error ? error.message : "No se pudo calcular la ruta.");
      } finally {
        setIsRouting(false);
      }
    },
    [destination, origin, transportMode]
  );

  const handleTransportChange = useCallback(
    (mode: TransportMode) => {
      setTransportMode(mode);
      if (origin && destination) {
        void calculateRoute(mode);
      }
    },
    [calculateRoute, destination, origin]
  );

  const handleMapClick = useCallback(
    (coordinate: Coordinate) => {
      if (selectionMode === "origin") {
        setOrigin(coordinate);
        setRoute(null);
        setSelectionMode("destination");
        setToast("Origen seleccionado. Ahora elige destino.");
      }

      if (selectionMode === "destination") {
        setDestination(coordinate);
        setRoute(null);
        setSelectionMode("none");
        setToast("Destino seleccionado. Puedes calcular la ruta.");
      }
    },
    [selectionMode]
  );

  const locateUser = useCallback(async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      setToast("Ubicacion actual encontrada.");
      mapActions?.centerOn(location, 15);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Activa tu ubicacion para usar tu posicion actual.");
    }
  }, [mapActions]);

  const useLocationAsOrigin = useCallback(() => {
    if (!userLocation) {
      setToast("Activa tu ubicacion para usar tu posicion actual.");
      return;
    }

    setOrigin(userLocation);
    setRoute(null);
    setToast("Ubicacion actual usada como origen.");
  }, [userLocation]);

  const toggle3D = useCallback(() => {
    const next = !is3D;
    setIs3D(next);
    mapActions?.set3D(next);
  }, [is3D, mapActions]);

  const floatingControls = useMemo(
    () => (
      <div className="pointer-events-auto absolute right-4 top-4 z-20 flex flex-col gap-3 md:right-6 md:top-6">
        <LocationButton onClick={locateUser} />
        <ZoomControls onZoomIn={() => mapActions?.zoomIn()} onZoomOut={() => mapActions?.zoomOut()} />
        <ThreeDButton enabled={is3D} onClick={toggle3D} />
      </div>
    ),
    [is3D, locateUser, mapActions, toggle3D]
  );

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-slate-100 text-slate-950">
      <MapView
        initialCenter={initialCenter}
        origin={origin}
        destination={destination}
        userLocation={userLocation}
        route={route}
        selectionMode={selectionMode}
        onMapClick={handleMapClick}
        onActionsReady={setMapActions}
        onMapReady={() => setToast("Mapa cargado correctamente.")}
        onMapError={() => setToast("No se pudo cargar el estilo del mapa.")}
      />

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto absolute left-0 top-0 w-full p-3 md:left-6 md:top-6 md:w-[390px] md:p-0">
          <SearchPanel
            origin={origin}
            destination={destination}
            selectionMode={selectionMode}
            transportMode={transportMode}
            canCalculate={canCalculate}
            isRouting={isRouting}
            onSelectOrigin={() => setSelectionMode("origin")}
            onSelectDestination={() => setSelectionMode("destination")}
            onUseCurrentLocation={useLocationAsOrigin}
            onTransportChange={handleTransportChange}
            onCalculate={() => calculateRoute()}
          />
        </div>

        {floatingControls}

        <div className="pointer-events-auto absolute bottom-3 left-3 right-3 z-20 md:bottom-6 md:left-6 md:right-auto md:w-[390px]">
          <RouteSummary route={route} mode={transportMode} toast={toast} />
        </div>
      </div>
    </main>
  );
}
