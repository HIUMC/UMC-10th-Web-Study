import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLPDetail, useUpdateLP } from "../hooks/queries/useLP";
import { useMyInfo } from "../hooks/queries/useUser";

export default function LPEditPage() {
  const { lpId } = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError } = useLPDetail(lpId);
  const { data: myInfo } = useMyInfo();
  const updateMutation = useUpdateLP(Number(lpId));

  const lp = data?.data;
  const myId = myInfo?.data.id;

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (!lp) return;

    setTitle(lp.title);
    setThumbnail(lp.thumbnail);
    setContent(lp.content);
    setTags(lp.tags.map((tag) => tag.name).join(", "));
  }, [lp]);

  const isAuthor = !!lp && !!myId && lp.authorId === myId;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lp) return;

    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    updateMutation.mutate(
      {
        title,
        thumbnail,
        content,
        tags: tagList,
        published: lp.published,
      },
      {
        onSuccess: () => {
          alert("LP가 수정되었습니다.");
          navigate("/lp/" + lp.id);
        },
      }
    );
  };

  if (isPending) {
    return <div className="text-[#c8c2b0]">로딩 중...</div>;
  }

  if (isError || !lp) {
    return <div className="text-[#c8c2b0]">LP 정보를 불러오지 못했습니다.</div>;
  }

  if (!isAuthor) {
    return (
      <section className="py-20 text-center text-[#c8c2b0]">
        이 LP를 수정할 권한이 없습니다.
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto panel-analog rounded-3xl p-8 shadow-2xl shadow-black/40">
      <h1 className="text-3xl font-black mb-8 text-[#e8ded4]">LP 수정</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="LP 제목"
          className="px-4 py-3 input-analog"
        />

        <input
          value={thumbnail}
          onChange={(event) => setThumbnail(event.target.value)}
          placeholder="썸네일 이미지 URL"
          className="px-4 py-3 input-analog"
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="LP 설명"
          className="min-h-36 px-4 py-3 input-analog resize-none"
        />

        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="태그 입력 예: rock, jazz, pop"
          className="px-4 py-3 input-analog"
        />

        <button
          disabled={updateMutation.isPending}
          className="mt-4 py-3 btn-primary"
        >
          수정하기
        </button>
      </form>
    </section>
  );
}