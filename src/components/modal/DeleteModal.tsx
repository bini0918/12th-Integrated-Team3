import { DayClouds } from '../../assets';
import { motion } from 'framer-motion';

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
    <motion.div
      className="fixed inset-0 bg-[#292E2E]/60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <motion.div
        className="bg-white w-[90%] max-w-md rounded-2xl p-8 shadow-xl relative text-center"
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
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
      </motion.div>
    </motion.div>
  );
}
