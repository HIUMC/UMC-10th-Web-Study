import { useReducer } from "react";
import axios from "axios";
import { usePostLp } from "../hooks/useLP";

interface Props {
  onClose: () => void;
}

type LpFormState = {
  title: string;
  content: string;
  tagInput: string;
  tags: string[];
};

type LpFormAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_CONTENT"; payload: string }
  | { type: "SET_TAG_INPUT"; payload: string }
  | { type: "ADD_TAG" }
  | { type: "DELETE_TAG"; payload: string }
  | { type: "RESET_FORM" };

const DEFAULT_THUMBNAIL = "https://picsum.photos/500/500";

const initialFormState: LpFormState = {
  title: "",
  content: "",
  tagInput: "",
  tags: [],
};

const lpFormReducer = (
  state: LpFormState,
  action: LpFormAction
): LpFormState => {
  switch (action.type) {
    case "SET_TITLE":
      return {
        ...state,
        title: action.payload,
      };

    case "SET_CONTENT":
      return {
        ...state,
        content: action.payload,
      };

    case "SET_TAG_INPUT":
      return {
        ...state,
        tagInput: action.payload,
      };

    case "ADD_TAG": {
      const trimmedTag = state.tagInput.trim();

      if (!trimmedTag || state.tags.includes(trimmedTag)) {
        return state;
      }

      return {
        ...state,
        tags: [...state.tags, trimmedTag],
        tagInput: "",
      };
    }

    case "DELETE_TAG":
      return {
        ...state,
        tags: state.tags.filter((tag) => tag !== action.payload),
      };

    case "RESET_FORM":
      return initialFormState;

    default:
      return state;
  }
};

const CreateLpModal = ({ onClose }: Props) => {
  const [formState, dispatch] = useReducer(lpFormReducer, initialFormState);

  const postLpMutation = usePostLp();

  const handleAddTag = () => {
    dispatch({ type: "ADD_TAG" });
  };

  const handleDeleteTag = (targetTag: string) => {
    dispatch({
      type: "DELETE_TAG",
      payload: targetTag,
    });
  };

  const handleSubmit = () => {
    if (!formState.title.trim() || !formState.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const finalTags = formState.tagInput.trim()
      ? Array.from(new Set([...formState.tags, formState.tagInput.trim()]))
      : formState.tags;

    const payload = {
      title: formState.title.trim(),
      content: formState.content.trim(),
      thumbnail: DEFAULT_THUMBNAIL,
      tags: finalTags,
    };

    console.log("LP 생성 요청 payload:", payload);

    postLpMutation.mutate(payload, {
      onSuccess: () => {
        alert("LP 생성 완료!");
        dispatch({ type: "RESET_FORM" });
        onClose();
      },
      onError: (error) => {
        console.error("LP 생성 실패 에러:", error);

        if (axios.isAxiosError(error)) {
          console.error("상태 코드:", error.response?.status);
          console.error("응답 데이터:", error.response?.data);

          alert(error.response?.data?.message || "LP 생성 실패!");
          return;
        }

        alert("LP 생성 실패!");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1f1f2e] p-8 text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-2xl text-white/70 hover:text-white"
        >
          ×
        </button>

        <div className="mb-6 flex justify-center">
          <div className="h-40 w-40 overflow-hidden rounded-full bg-black">
            <img
              src={DEFAULT_THUMBNAIL}
              alt="LP 기본 이미지"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-4">
          <input
            value={formState.title}
            onChange={(e) =>
              dispatch({
                type: "SET_TITLE",
                payload: e.target.value,
              })
            }
            placeholder="LP Name"
            className="w-full rounded-md border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-pink-500"
          />

          <input
            value={formState.content}
            onChange={(e) =>
              dispatch({
                type: "SET_CONTENT",
                payload: e.target.value,
              })
            }
            placeholder="LP Content"
            className="w-full rounded-md border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-pink-500"
          />

          <div className="flex gap-2">
            <input
              value={formState.tagInput}
              onChange={(e) =>
                dispatch({
                  type: "SET_TAG_INPUT",
                  payload: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="LP Tag"
              className="flex-1 rounded-md border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-pink-500"
            />

            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-md bg-pink-500 px-4 font-bold text-white hover:bg-pink-600"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formState.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 rounded-md bg-black px-3 py-1 text-sm"
              >
                <span>{tag}</span>

                <button
                  type="button"
                  onClick={() => handleDeleteTag(tag)}
                  className="text-white/70 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={postLpMutation.isPending}
            className="w-full rounded-md bg-pink-500 py-3 font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {postLpMutation.isPending ? "추가 중..." : "Add LP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLpModal;