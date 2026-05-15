import DownloadButton from "../components/DownloadButton";

const Downloads = () => {

  const unlocked =
    localStorage.getItem("downloadsUnlocked");

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Downloads
      </h1>

      {unlocked ? (

        <div>

          <p className="mb-4 text-green-600">
            Downloads unlocked
          </p>

          <DownloadButton
            fileUrl="https://example.com/file.zip"
          />

        </div>

      ) : (

        <div>

          <p className="text-red-500 mb-4">
            Payment required
          </p>

          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Locked
          </button>

        </div>
      )}
    </div>
  );
};

export default Downloads;