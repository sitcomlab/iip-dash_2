export default function BaseTile({
  height = "col-span-1",
  width = "col-span-1",
  children,
}) {
  return (
    <div
      className={`${height} ${width} min-w-96 bg-white rounded-2xl shadow-md p-8 pt-4 m-2`}
    >
      {children}
    </div>
  );
}
