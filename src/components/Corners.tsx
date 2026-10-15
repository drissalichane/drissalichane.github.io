// Blueprint corner ticks drawn over a bordered box (the parent must be `relative`).
export default function Corners() {
    const tick = "pointer-events-none absolute h-3 w-3 border-primary";
    return (
        <>
            <span className={`${tick} -left-px -top-px border-l-2 border-t-2`} />
            <span className={`${tick} -right-px -top-px border-r-2 border-t-2`} />
            <span className={`${tick} -bottom-px -left-px border-b-2 border-l-2`} />
            <span className={`${tick} -bottom-px -right-px border-b-2 border-r-2`} />
        </>
    );
}
