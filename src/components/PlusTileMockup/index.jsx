export default function PlusTile({
  height = "h-96",
  width = "w-96",
  children,
}) {
  return (
    <div className={`${height} ${width} m-2`}>
      <div
        className="h-32 w-32
        flex justify-center
        relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        bg-white rounded-2xl shadow-md m-2
        "
      >
        <div className="align-middle text-center text-8xl text-theme-green pt-2 drop-shadow">
          <div>+</div>
        </div>
      </div>
    </div>
  );
}
