import Link from "next/link";

// icons
import { FaStar } from "react-icons/fa";

// component
import ImgLazy from "../shared/Imglazy";
import { TypeComment } from "@/app/types/comment";

export default function CommentItem({ comment }: { comment: TypeComment }) {
  return (
    <li className="cardComment--list__item flex gap-x-2">
      <div className="comment--avata w-10 h-10 rounded-full overflow-hidden ">
        <ImgLazy
          src={
            comment.nguoi_danh_gia.hinh
              ? comment.nguoi_danh_gia.hinh
              : "./images/avatar.png"
          }
          alt="avata user"
          className="img-full"
        />
      </div>
      {/* content  */}
      <div className="cardComment--info">
        <div className="cardComment--info__top">
          <span className="user--name text-[15px] font-medium line-clamp-2">
            {!comment.nguoi_danh_gia.ho_ten && "Nguyễn Văn A"}
          </span>
          <div className="user--star flex-y-center gap-x-1 mt-1">
            {Array.from({ length: comment.so_sao }).map((item, i) => (
              <FaStar key={i} className="w-[15px] h-[18px] fill-[#FFC205]" />
            ))}
          </div>
          <div className="date text-xs text-neutral-500 mt-2">
            <span className="date_content inline-block">30/08/2025</span>
          </div>
          <div className="classify flex flex-col gap-y-2 mt-2 text-sm text-neutral-500">
            <div className="features block pl-[2px]">
              Tính năng: <span>{comment.tinh_nang}</span>
            </div>
            {/* <div className="color block pl-[2px]">
              Tính năng: <span>{comment.}</span>
            </div> */}
          </div>

          <div className="cardComment--main mt-3">
            <p className="cardComment--main__content text-sm line-clamp-5">
              {comment.noi_dung}
            </p>
            <div className="cardComment--main__img w-[72px] h-[72px] overflow-hidden rounded-md mt-3">
              <ImgLazy
                src="./images/product/product-2.png"
                alt="sản phẩm 2"
                className="img-full"
              />
            </div>
            {comment.phan_hoi && (
              <div className="seller--feedback relative p-[14px_12px] mt-4 rounded-lg bg-[#ebebeb] before:content-[''] before:block before:w-0 before:h-0 before:border-[8px] before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-b-[#ebebeb] before:absolute before:bottom-full before:left-4">
                <span className="seller--feedback__title block text-[15px]">
                  Phản Hồi Của Người Bán
                </span>
                <p className="seller--feedback__content text-sm text-[#5C5C5C] mt-2">
                  {comment.phan_hoi}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
