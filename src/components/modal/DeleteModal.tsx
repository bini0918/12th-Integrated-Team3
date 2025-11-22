import { DayClouds } from '../../assets';

interface DeleteConfirmModalProps {
  open: boolean;
  locationName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  open,
  locationName,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50 text-center">
      <div className="bg-white w-auto rounded-xl px-27 py-9 shadow-xl">
        <h2 className="text-3xl font-semibold mb-6">정말로 삭제하시겠습니까?</h2>
        <img src={DayClouds} alt="삭제 할거예요?" className="w-40 h-40 mb-6 mx-auto" />
        <p className="text-sm text-gray-600 mb-6">
          {locationName ? `"${locationName}" 위치가 삭제됩니다.` : '이 위치가 삭제됩니다.'}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-white hover:bg-gray-300 transition border border-gray-600 cursor-pointer ml-3"
          >
            취소하기
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-black text-white hover:bg-[#FF3232] transition cursor-pointer"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
