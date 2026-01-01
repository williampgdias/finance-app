export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow h-40 flex items-center justify-center text-gray-400">
                    Widget 1 (Balance)
                </div>
                <div className="bg-white p-6 rounded-lg shadow h-40 flex items-center justify-center text-gray-400">
                    Widget 2 (Income)
                </div>
                <div className="bg-white p-6 rounded-lg shadow h-40 flex items-center justify-center text-gray-400">
                    Widget 3 (Expenses)
                </div>
            </div>
        </main>
    );
}
