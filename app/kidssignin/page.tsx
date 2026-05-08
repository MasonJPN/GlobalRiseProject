type Kid = {
  id: number;
  firstName: string;
  lastName: string;
};

const kids: Kid[] = [
  { id: 1, firstName: "Yuki", lastName: "Tanaka" },
  { id: 2, firstName: "Hana", lastName: "Sato" },
  { id: 3, firstName: "Kenji", lastName: "Yamamoto" },
  { id: 4, firstName: "Aoi", lastName: "Nakamura" },
  { id: 5, firstName: "Ren", lastName: "Kobayashi" },
];

export default function KidsSignin() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Student Sign-In / Sign-Out
      </h1>

      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {kids.map(kid => (
          <div
            key={kid.id}
            className="flex items-center justify-between bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100"
          >
            <p className="text-xl font-semibold text-gray-800">
              {kid.lastName} {kid.firstName}
            </p>

            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-xl text-sm font-semibold bg-green-100 text-green-700 hover:bg-green-200">
                Sign In
              </button>
              <button className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-100 text-red-500 hover:bg-red-200">
                Sign Out
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}