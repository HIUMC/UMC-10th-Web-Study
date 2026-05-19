import { useMutation } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import type { RequestUpdateMyInfoDto } from "../../types/auth";

function useUpdateMyInfo() {
  return useMutation({
    mutationFn: (body: RequestUpdateMyInfoDto) => patchMyInfo(body),
  });
}

export default useUpdateMyInfo;
