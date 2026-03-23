import { IoMdClose } from "react-icons/io";

import Link from "next/link";

import orderService from "@/app/services/orderServices";

import { TypeOrderDetail } from "@/app/types/type";
import { formatMoney } from "@/app/utils/helper";
import SectionCancel from "./sectionCancel";

export default function SectionSuccess() {
  return <SectionCancel />;
}
