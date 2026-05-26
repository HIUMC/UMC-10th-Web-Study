import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createComment } from "../../apis/comment";
import { lpCommentsQueryKey } from "../../hooks/queries/useGetLpComments";
import type { CommentOrder } from "../../types/comment";

interface CommentFormProps {
  lpid: number;
  order: CommentOrder;
}

const MAX_LEN = 200;

const CommentForm = ({ lpid, order }: CommentFormProps) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const isInvalid = trimmed.length === 0 || trimmed.length > MAX_LEN;

  const { mutate, isPending } = useMutation({
    mutationFn: () => createComment(lpid, { content: trimmed }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: lpCommentsQueryKey(lpid, order),
      });
      setValue("");
    },
    onError: () => {
      alert("댓글 작성에 실패했습니다.");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isInvalid) mutate();
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="댓글을 입력해주세요"
          maxLength={MAX_LEN}
          className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isInvalid || isPending}
          className="cursor-pointer rounded bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
        >
          {isPending ? "..." : "작성"}
        </button>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">
          {trimmed.length === 0
            ? "댓글을 입력해주세요."
            : trimmed.length > MAX_LEN
              ? `최대 ${MAX_LEN}자까지 입력할 수 있습니다.`
              : " "}
        </span>
        <span className="text-gray-500">
          {value.length} / {MAX_LEN}
        </span>
      </div>
    </form>
  );
};

export default CommentForm;
