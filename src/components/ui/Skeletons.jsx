// Componente base riutilizzabile
const Bone = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

// ─────────────────────────────────────────
// 1. DASHBOARD HOME
// ─────────────────────────────────────────
export function SkeletonDashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Bone className="h-9 w-72 mb-3" />
        <Bone className="h-4 w-96" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Bone className="h-24 rounded-xl" />
        <Bone className="h-24 rounded-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Bone className="h-12 w-12 rounded-lg" />
              <Bone className="h-4 w-10" />
            </div>
            <Bone className="h-9 w-16 mb-2" />
            <Bone className="h-4 w-28 mb-1" />
            <Bone className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Bone className="h-6 w-40 mb-5" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <Bone className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Bone className="h-4 w-40 mb-2" />
                <Bone className="h-3 w-56" />
              </div>
              <Bone className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 2. JOBS LIST
// ─────────────────────────────────────────
export function SkeletonJobsList() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Bone className="h-9 w-40 mb-3" />
          <Bone className="h-4 w-48" />
        </div>
        <Bone className="h-11 w-36 rounded-lg" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            {/* Titolo + badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Bone className="h-5 w-3/4 mb-2" />
                <Bone className="h-4 w-1/2" />
              </div>
              <Bone className="h-6 w-16 rounded-full" />
            </div>

            {/* Info row */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Bone className="h-4 w-24" />
              <Bone className="h-4 w-32" />
              <Bone className="h-4 w-20" />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[1, 2, 3].map((j) => (
                <Bone key={j} className="h-6 w-16 rounded-full" />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <Bone className="h-9 flex-1 rounded-lg" />
              <Bone className="h-9 w-9 rounded-lg" />
              <Bone className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 3. MATCHES
// ─────────────────────────────────────────
export function SkeletonMatches() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Bone className="h-9 w-52 mb-3" />
          <Bone className="h-4 w-80" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Bone className="h-8 w-8 rounded-full" />
                <Bone className="h-4 w-24" />
              </div>
              <Bone className="h-9 w-16" />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Bone key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>

        {/* Match Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              {/* Avatar + nome */}
              <div className="flex items-center gap-3 mb-4">
                <Bone className="h-14 w-14 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Bone className="h-5 w-32 mb-2" />
                  <Bone className="h-4 w-24" />
                </div>
                <Bone className="h-6 w-16 rounded-full" />
              </div>

              {/* Info */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Bone className="h-4 w-20" />
                <Bone className="h-4 w-28" />
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3, 4].map((j) => (
                  <Bone key={j} className="h-6 w-14 rounded-full" />
                ))}
              </div>

              {/* CTA */}
              <Bone className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 4. CANDIDATES SWIPE
// ─────────────────────────────────────────
export function SkeletonCandidates() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Bone className="h-9 w-56 mb-3" />
            <Bone className="h-4 w-36" />
          </div>
          <Bone className="h-12 w-32 rounded-lg" />
        </div>

        {/* Card candidato */}
        <div
          className="bg-white rounded-2xl shadow-2xl p-8"
          style={{ height: "600px" }}
        >
          {/* Avatar + nome */}
          <div className="flex items-center gap-4 mb-6">
            <Bone className="h-20 w-20 rounded-full flex-shrink-0" />
            <div>
              <Bone className="h-7 w-48 mb-2" />
              <Bone className="h-4 w-36" />
            </div>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-3 mb-5">
            <Bone className="h-5 w-24" />
            <Bone className="h-5 w-32" />
            <Bone className="h-5 w-20" />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <Bone className="h-4 w-full mb-2" />
            <Bone className="h-4 w-5/6 mb-2" />
            <Bone className="h-4 w-4/6" />
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Bone key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Bottoni azione */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <Bone className="h-16 w-16 rounded-full" />
          <Bone className="h-14 w-14 rounded-full" />
          <Bone className="h-16 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 5. CHAT LIST
// ─────────────────────────────────────────
export function SkeletonChatList() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-full max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Bone className="h-9 w-20 mb-3" />
          <Bone className="h-4 w-40" />
        </div>

        {/* Search */}
        <Bone className="h-12 w-full rounded-xl mb-6" />

        {/* Lista conversazioni */}
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200"
            >
              <Bone className="h-12 w-12 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Bone className="h-4 w-36" />
                  <Bone className="h-3 w-10" />
                </div>
                <Bone className="h-3 w-48 mb-1" />
                <Bone className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 6. CHAT DETAIL
// ─────────────────────────────────────────
export function SkeletonChatDetail() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Bone className="h-9 w-9 rounded-lg flex-shrink-0" />
        <Bone className="h-10 w-10 rounded-full flex-shrink-0" />
        <div>
          <Bone className="h-5 w-36 mb-1" />
          <Bone className="h-3 w-24" />
        </div>
      </div>

      {/* Messaggi */}
      <div className="flex-1 p-6 space-y-4 overflow-hidden">
        {/* Messaggi alternati loro/noi */}
        <div className="flex justify-start">
          <Bone className="h-12 w-56 rounded-2xl rounded-tl-none" />
        </div>
        <div className="flex justify-end">
          <Bone className="h-10 w-44 rounded-2xl rounded-tr-none" />
        </div>
        <div className="flex justify-start">
          <Bone className="h-16 w-64 rounded-2xl rounded-tl-none" />
        </div>
        <div className="flex justify-end">
          <Bone className="h-10 w-52 rounded-2xl rounded-tr-none" />
        </div>
        <div className="flex justify-start">
          <Bone className="h-12 w-48 rounded-2xl rounded-tl-none" />
        </div>
        <div className="flex justify-end">
          <Bone className="h-14 w-60 rounded-2xl rounded-tr-none" />
        </div>
      </div>

      {/* Input box */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-center gap-3">
        <Bone className="flex-1 h-12 rounded-xl" />
        <Bone className="h-12 w-12 rounded-xl flex-shrink-0" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 7. CANDIDATE PROFILE [id]
// ─────────────────────────────────────────
export function SkeletonCandidateProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-8 pt-8 pb-12">
          <Bone className="h-8 w-28 mb-8 bg-white/30" />
          <div className="flex items-center gap-6">
            <Bone className="h-24 w-24 rounded-full flex-shrink-0 bg-white/30" />
            <div>
              <Bone className="h-8 w-56 mb-3 bg-white/30" />
              <Bone className="h-5 w-40 mb-2 bg-white/30" />
              <Bone className="h-4 w-32 bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenuto */}
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        {/* Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Bone className="h-6 w-32 mb-5" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Bone className="h-3 w-20 mb-2" />
                <Bone className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Bone className="h-6 w-24 mb-5" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Bone key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Bio Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Bone className="h-6 w-16 mb-5" />
          <Bone className="h-4 w-full mb-2" />
          <Bone className="h-4 w-5/6 mb-2" />
          <Bone className="h-4 w-4/6" />
        </div>

        {/* Azioni */}
        <div className="flex gap-4">
          <Bone className="h-12 flex-1 rounded-lg" />
          <Bone className="h-12 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
