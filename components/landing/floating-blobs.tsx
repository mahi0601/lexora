export function FloatingBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="aurora-blob aurora-blob-delay-1 -top-32 -left-24 size-[28rem] bg-aurora-1" />
      <div className="aurora-blob aurora-blob-delay-2 top-1/3 -right-32 size-[32rem] bg-aurora-2" />
      <div className="aurora-blob bottom-[-10rem] left-1/4 size-[26rem] bg-aurora-3" />
    </div>
  );
}
