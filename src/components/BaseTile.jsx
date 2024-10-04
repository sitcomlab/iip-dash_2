export default function BaseTile({height="h-96", width="w-96", children}) {

    return (
        <div className={`${height} ${width} bg-white rounded-2xl shadow-md p-8 pt-4 m-2`}>
            {children}
        </div>
    )
}