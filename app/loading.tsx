export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="size-12 rounded-full border-4 border-gray-200" />
          <div className="size-12 rounded-full border-4 border-t-[#009C3B] border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin" />
        </div>
        <p className="text-sm text-gray-500 font-medium">Carregando dados fiscais...</p>
      </div>
    </div>
  );
}
