"use client";
import ImgLazy from "@/app/components/shared/Imglazy";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import React, { useState } from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Fancybox, Carousel } from "@fancyapps/ui/dist/fancybox/";
import { useEffect } from "react";
import useFancybox from "@/app/hook/useFancybox";
import { IoIosClose } from "react-icons/io";
import { validatorPrice, validatorString } from "@/app/utils/form";
import clsx from "clsx";
import { ApiError, TypeCategory } from "@/app/types/type";
import SelectClient from "@/app/components/user/SelectClient";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import productServices from "@/app/services/productServices";
import { toast } from "react-toastify";
import { formatMoney } from "@/app/utils/helper";

export default function SectionAddProduct({
  categoriesSelect,
  thuonghieuSelect,
  attribiteSelect,
}: {
  categoriesSelect: { value: string; label: string }[];
  thuonghieuSelect: { value: string; label: string }[];
  attribiteSelect: { value: string; label: string }[];
}) {
  //   plugin
  const [fancyboxRef] = useFancybox({});
  // data post
  const [filesImg, setFilesImg] = useState<File[]>([]);
  const [hinh_bien_the, setHinh_bien_the] = useState<File[]>([]);
  const [nameProduct, setNameProduct] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [priceSale, setPriceSale] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [dvt, setDvt] = useState<string>("");
  const [categories, setCategories] = useState<string | undefined>("");
  const [trademark, setTrademark] = useState<string | undefined>("");
  const [origin, setOrigin] = useState<string>("");
  const [dvctn, setDvctn] = useState<string>("");
  const [statusPrd, setStatusPrd] = useState<string | undefined>("1");
  const [desc, setDesc] = useState<string>("");
  const [previewPriceSale, setPreviewPriceSale] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  type AttributeItem = {
    id: number;
    value?: string;
    label: string | undefined;
    error: string;
    success: boolean;
  };

  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  // console.log(attributes);
  const [variants, setVariants] = useState<
    {
      id: number;
      name: string;
      code: string;
      price: string;
      quantity: string;
      hinh_bien_the: File | undefined;
      err: {
        name: string;
        code: string;
        price: string;
        quantity: string;
        hinh_bien_the: string;
      };
      success: {
        name: boolean;
        code: boolean;
        price: boolean;
        quantity: boolean;
        hinh_bien_the: boolean;
      };
    }[]
  >([]);
  const [isSuccess, setIsSuccess] = useState({
    nameProduct: false,
    price: false,
    priceSale: false,
    quantity: false,
    dvt: false,
    categories: false,
    origin: false,
    dvctn: false,
    trademark: false,
    statusPrd: false,
    attribute: false,
    code: false,
  });
  const [arrErr, setArrErr] = useState({
    nameProduct: "",
    price: "",
    priceSale: "",
    quantity: "",
    dvt: "",
    categories: "",
    origin: "",
    dvctn: "",
    trademark: "",
    statusPrd: "",
    attribute: "",
    code: "",
  });
  //   set img
  const handleSetImgProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFilesImg((prev) => [...prev, ...Array.from(files)]);
  };

  const handleCloseImgPreview = (index: number) => {
    setFilesImg((prev) => prev.filter((_, i) => i !== index));
  };

  //   name
  const handleNameProduct = (val: string) => {
    setNameProduct(val);
    const isValid = validatorString(
      val,
      (errMsg) => setArrErr((prev) => ({ ...prev, nameProduct: errMsg })),
      { maxLength: 250, minLength: 5 }
    );
    setIsSuccess((prev) => ({ ...prev, nameProduct: isValid }));
  };
  const handleCode = (val: string) => {
    setCode(val);
    // const isValid = validatorString(
    //   val,
    //   (errMsg) => setArrErr((prev) => ({ ...prev, code: errMsg })),
    //   { maxLength: 50 }
    // );
    // setIsSuccess((prev) => ({ ...prev, code: isValid }));
  };

  const handlePrice = (val: string) => {
    setPrice(val);
    const isValid = validatorPrice(val, (errMsg: string) => {
      setArrErr((prev) => ({ ...prev, price: errMsg }));
    });

    setIsSuccess((prev) => ({ ...prev, price: isValid }));
  };

  // preview price sale
  useEffect(() => {
    if (!price.trim()) return;
    if (!priceSale.trim()) {
      setPreviewPriceSale(0);
      return;
    }
    const sale = Number(priceSale);
    if (sale >= 100 || sale <= 0) return;
    setPreviewPriceSale(Number(Number(price) * (1 - sale / 100)));
    // sale hợp lệ (1–100)
  }, [priceSale, price]);

  const handlePriceSale = (val: string) => {
    setPriceSale(val);
    let isValid = true;
    if (val.trim() && Number(val) >= 100) {
      setArrErr((prev) => ({
        ...prev,
        priceSale: "Giá Sale không được lớn hơn hoặc bằng 100%.",
      }));
      isValid = false;
    } else if (val.trim() && Number(val) <= 0) {
      setArrErr((prev) => ({
        ...prev,
        priceSale: "Giá Sale không được bé hơn 1%.",
      }));
      isValid = false;
    } else {
      setArrErr((prev) => ({
        ...prev,
        priceSale: "",
      }));
      isValid = true;
    }

    setIsSuccess((prev) => ({ ...prev, priceSale: isValid }));
  };

  const handleQuantity = (val: string) => {
    setQuantity(val);
    if (!val) {
      setArrErr((prev) => ({ ...prev, quantity: "Không được để trống." }));
      setIsSuccess((prev) => ({ ...prev, quantity: false }));
    } else if (Number(val) < 1) {
      setArrErr((prev) => ({
        ...prev,
        quantity: "Số lượng không được bé hơn 1.",
      }));
      setIsSuccess((prev) => ({ ...prev, quantity: false }));
    } else {
      setArrErr((prev) => ({ ...prev, quantity: "" }));
      setIsSuccess((prev) => ({ ...prev, quantity: true }));
    }
  };

  const handleDvt = (val: string) => {
    setDvt(val);
    const isValid = validatorString(
      val,
      (errMsg: string) => {
        setArrErr((prev) => ({ ...prev, dvt: errMsg }));
      },
      { maxLength: 10 }
    );
    setIsSuccess((prev) => ({ ...prev, dvt: isValid }));
  };

  //
  const handleOrigin = (val: string) => {
    setOrigin(val);
    const isValid = validatorString(
      val,
      (errMsg: string) => {
        setArrErr((prev) => ({ ...prev, origin: errMsg }));
      },
      { maxLength: 100 }
    );
    setIsSuccess((prev) => ({ ...prev, origin: isValid }));
  };

  const handleDvctn = (val: string) => {
    setDvctn(val);
    const isValid = validatorString(
      val,
      (errMsg: string) => {
        setArrErr((prev) => ({ ...prev, dvctn: errMsg }));
      },
      { maxLength: 250 }
    );
    setIsSuccess((prev) => ({ ...prev, dvctn: isValid }));
  };

  const handleTrademark = (val: string | undefined) => {
    setTrademark(val);
    if (!val) {
      setIsSuccess((prev) => ({ ...prev, trademark: false }));
      setArrErr((prev) => ({ ...prev, trademark: "Không được để trống." }));
    } else {
      setIsSuccess((prev) => ({ ...prev, trademark: true }));
      setArrErr((prev) => ({ ...prev, trademark: "" }));
    }
  };

  //   add attribute
  const handleAttribute = (val: { value?: string; label?: string }) => {
    if (!val?.value) return;

    setAttributes((prev) => {
      const id = Number(val.value);
      if (prev.some((item) => item.id === id)) return prev;
      return [
        ...prev,
        {
          id,
          value: "",
          label: val.label,
          error: "",
          success: false,
        },
      ];
    });
  };

  const handleValidatorAttribute = (id: number, val: string) => {
    setAttributes((prev) =>
      prev.map((att) => {
        if (Number(att.id) !== Number(id)) return att;

        let errMsg = "";
        let isvalid = validatorString(val, (err) => (errMsg = err), {
          maxLength: 100,
        });
        return {
          ...att,
          value: val,
          error: errMsg,
          success: isvalid,
        };
      })
    );
  };

  const handleCategories = (val: string | undefined) => {
    setCategories(val);
    if (!val) {
      setIsSuccess((prev) => ({ ...prev, categories: false }));
      setArrErr((prev) => ({ ...prev, categories: "Không được để trống." }));
    } else {
      setIsSuccess((prev) => ({ ...prev, categories: true }));
      setArrErr((prev) => ({ ...prev, categories: "" }));
    }
  };

  //   add variant

  const handleAddVariant = () => {
    setVariants((pre) => [
      ...pre,
      {
        id: Date.now(),
        name: "",
        code: "",
        price: "",
        quantity: "",
        hinh_bien_the: undefined,
        err: { name: "", code: "", price: "", quantity: "", hinh_bien_the: "" },
        success: {
          name: false,
          code: false,
          price: false,
          quantity: false,
          hinh_bien_the: false,
        },
      },
    ]);
  };

  const handleValidatorVariantAll = (
    id: number,
    field: "code" | "price" | "name" | "quantity" | "hinh_bien_the",
    val: string | File | undefined
  ) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (Number(v.id) !== Number(id)) return v;
        let isValid = false;
        let errMsg = "";
        if (field === "name") {
          isValid = validatorString(val as string, (err) => (errMsg = err));
        } else if (field === "price") {
          isValid = validatorPrice(val as string, (err) => (errMsg = err));
        } else if (field === "quantity") {
          if (Number(val) < 1) {
            isValid = false;
            errMsg = "Số lượng phải lớn hơn 1.";
          } else {
            isValid = true;
            errMsg = "";
          }
        } else if (field === "hinh_bien_the") {
        }
        return {
          ...v,
          [field]: val,
          err: { ...v.err, [field]: errMsg },
          success: { ...v.success, [field]: isValid },
        };
      })
    );
  };

  //delete variant
  const handleRemoveVariant = (id: number) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  //   handle main
  const handleAddproductSeller = async () => {
    // call lần cuối
    handleNameProduct(nameProduct);
    handlePrice(price);
    handlePriceSale(priceSale);
    handleQuantity(quantity);
    handleDvt(dvt);
    handleOrigin(origin);
    handleDvctn(dvctn);
    handleTrademark(trademark);
    // handleValidatorAttribute;
    handleCategories(categories);
    // handleCode(code);
    // handleValidatorVariantAll;
    if (
      !isSuccess.nameProduct ||
      !isSuccess.price ||
      !isSuccess.priceSale ||
      !isSuccess.quantity ||
      !isSuccess.dvt ||
      !isSuccess.origin ||
      !isSuccess.dvctn ||
      !isSuccess.trademark ||
      !isSuccess.categories
      // !isSuccess.code
    ) {
      toast.warning("Không đủ thông tin sản phẩm");
      return;
    }
    const thuoc_tinh = attributes.map((item) => ({
      id_tt: item.id,
      value: item.value,
    }));

    const bien_the = variants.map((item) => ({
      so_luong: item.quantity,
      ten_bien_the: item.name,
      code: item.code,
      gia: item.price,
    }));
    //
    // const dataPost = {
    //   ten_sp: nameProduct,
    //   gia: price,
    //   sale: priceSale,
    //   so_luong: quantity,
    //   xuat_xu: origin,
    //   dvctn: dvctn,
    //   dvt: dvt,
    //   mo_ta: desc,
    //   an_hien: statusPrd,
    //   id_dm: categories,
    //   id_th: trademark,
    //   thuoc_tinh: thuoc_tinh,
    //   bien_the: variants,
    // };
    // console.log(dataPost);

    const formData = new FormData();
    formData.append("ten_sp", nameProduct);
    formData.append("code", code);
    formData.append("gia", price);
    formData.append("sale", priceSale);
    filesImg.forEach((img) => {
      formData.append("hinh_sp", img);
    });
    formData.append("so_luong", quantity);
    formData.append("xuat_xu", origin);
    formData.append("dvctn", dvctn);
    formData.append("dvt", dvt);
    formData.append("mo_ta", desc);
    if (statusPrd) formData.append("an_hien", statusPrd);
    if (categories) formData.append("id_dm", categories);
    if (trademark) formData.append("id_th", trademark);
    formData.append("thuoc_tinh", JSON.stringify(thuoc_tinh));
    formData.append("bien_the", JSON.stringify(bien_the));
    variants.forEach((item, i) => {
      formData.append(
        `hinh_bien_the_${i}`,
        item.hinh_bien_the ? item.hinh_bien_the : ""
      );
    });
    console.log(variants);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      const res = await productServices.addProductSeller(formData);
      console.log(res.data);
      if (!res.success) return;
      toast.success("Thêm sản phẩm thành công.");
    } catch (err) {
      console.log(err);
      const error = err as ApiError;
      if (error.status === 409 || error.status == 400) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi xin vui lòng thử lại sau!");
      }
    }
  };
  const handleCloseImgVariant = (id: number) => {
    setVariants((prev) => {
      return prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, hinh_bien_the: undefined };
      });
    });
    // console.log(variants);
  };

  return (
    <section className="section--addProduct section-py">
      <div className="wrap--page">
        <div className="form--addProduct flex flex-col gap-y-4">
          {/* block form group */}
          <div className="form--group flex flex-col gap-y-3 bg-white p-3 rounded-sm">
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Hình sản phẩm
                <span className="text-red-600">*</span>
              </label>
              <div className="wrap--previewAddImg flex-y-center gap-x-3">
                {filesImg && filesImg.length > 0 && (
                  <div
                    ref={fancyboxRef}
                    className="imgPreview--list flex-y-center gap-x-3"
                  >
                    {filesImg.map((img, i) => (
                      <div key={i} className="block--imgPreview relative">
                        <button
                          className="remove flex-center w-3.5 h-3.5 rounded-full bg-accentColor/70 absolute -right-1 -top-1 z-10 text-base text-white hover:bg-accentColor transition-all-300-ease"
                          onClick={() => handleCloseImgPreview(i)}
                        >
                          <IoIosClose />
                        </button>
                        <a
                          key={i}
                          href={URL.createObjectURL(img)}
                          data-fancybox="previewImgProduce"
                          data-caption={`Ảnh ${i + 1}`}
                          className="img--preview inline-block w-20 h-20 rounded-md overflow-hidden"
                        >
                          <ImgLazy
                            src={URL.createObjectURL(img)}
                            alt={`img preview ${i + 1}`}
                            wrapperClassName="inline-block w-full h-full"
                            className="img-full"
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                {/*  */}
                <div className="block--inp ">
                  <div className="block--choseImg relative flex-center w-20 h-20 overflow-hidden rounded-md border border-dashed border-accentColor cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      //   onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleSetImgProduct(e)}
                    />
                    <span className="content text-xs text-accentColor">
                      Thêm ảnh
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          {/* block form group */}
          <div className="form--group flex flex-col gap-y-3 bg-white p-3 rounded-sm">
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Tên sản phẩm
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  className="style-inp-1 w-full"
                  onChange={(e) => handleNameProduct(e.target.value)}
                />
                {arrErr.nameProduct && (
                  <span className={clsx("err--form")}>
                    {arrErr.nameProduct}
                  </span>
                )}
              </div>
            </div>
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Code
                {/* <span className="text-red-600">*</span> */}
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  className="style-inp-1 w-full"
                  onChange={(e) => handleCode(e.target.value)}
                />
                {arrErr.code && (
                  <span className={clsx("err--form")}>{arrErr.code}</span>
                )}
              </div>
            </div>
          </div>
          {/*  */}
          {/* block form group */}
          <div className="form--group flex flex-col gap-y-3  bg-white p-3 rounded-sm">
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Giá
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="number"
                  className="style-inp-1 w-full"
                  onChange={(e) => handlePrice(e.target.value)}
                />
                {arrErr.price && (
                  <span className={clsx("err--form")}>{arrErr.price}</span>
                )}
              </div>
            </div>
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Giá Sale
                {/* <span className="text-red-600">*</span> */}
              </label>
              <div className="flex-1">
                <input
                  type="number"
                  className="style-inp-1 w-full"
                  onChange={(e) => handlePriceSale(e.target.value)}
                />
                {previewPriceSale > 0 && (
                  <span className="inline-block mt-2 text-sm text-neutral-500">
                    Giá đã trừ đi sale {formatMoney(previewPriceSale)}
                  </span>
                )}
                {arrErr.priceSale && (
                  <span className={clsx("err--form")}>{arrErr.priceSale}</span>
                )}
              </div>
            </div>
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Số lượng
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="number"
                  className="style-inp-1 w-ful"
                  onChange={(e) => handleQuantity(e.target.value)}
                  defaultValue={quantity}
                  min={1}
                />
                {arrErr.quantity && (
                  <span className={clsx("err--form")}>{arrErr.quantity}</span>
                )}
              </div>
            </div>
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Đơn vị tính
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  className="style-inp-1 w-full"
                  onChange={(e) => handleDvt(e.target.value)}
                />
                {arrErr.dvt && (
                  <span className={clsx("err--form")}>{arrErr.dvt}</span>
                )}
              </div>
            </div>
          </div>
          {/*  */}
          {/*  */}
          {/* block form group */}
          <div className="form--group flex flex-col gap-y-3  bg-white p-3 rounded-sm">
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Danh mục
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <SelectClient
                  options={categoriesSelect}
                  className="grow w-full"
                  placeholder="Danh mục"
                  onChange={(val) => handleCategories(val?.value)}
                />
                {arrErr.categories && (
                  <span className={clsx("err--form")}>{arrErr.categories}</span>
                )}
              </div>
            </div>
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Thương hiệu
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <SelectClient
                  options={thuonghieuSelect}
                  className="w-full"
                  placeholder="Thương hiệu"
                  onChange={(val) => handleTrademark(val?.value)}
                />
                {arrErr.trademark && (
                  <span className={clsx("err--form")}>{arrErr.trademark}</span>
                )}
              </div>
            </div>
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Xuất xứ
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  className="style-inp-1 w-full"
                  onChange={(e) => handleOrigin(e.target.value)}
                />
                {arrErr.origin && (
                  <span className={clsx("err--form")}>{arrErr.origin}</span>
                )}
              </div>
            </div>
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Đơn vị chịu trách nhiệm
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  className="style-inp-1 w-full"
                  onChange={(e) => handleDvctn(e.target.value)}
                />
                {arrErr.dvctn && (
                  <span className={clsx("err--form")}>{arrErr.dvctn}</span>
                )}
              </div>
            </div>
          </div>
          {/*  */}
          {/* block form group */}
          <div className="form--group flex flex-col gap-y-3 bg-white p-3 rounded-sm">
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Trạng thái
                <span className="text-red-600">*</span>
              </label>
              <SelectClient
                className="grow"
                options={[
                  { value: "1", label: "Hiện" },
                  { value: "0", label: "Ẩn" },
                ]}
                placeholder="Trạng thái"
                defaultOption={{ value: "1", label: "Hiện" }}
                onChange={(val) => setStatusPrd(val?.value)}
              />
            </div>
          </div>
          {/*  */}
          {/* block form group */}
          <div className="form--group flex flex-col gap-y-3 bg-white p-3 rounded-sm">
            <div className="group--block flex-y-center gap-x-3">
              <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
                Thuộc tính
                <span className="text-red-600">*</span>
              </label>
              <div className="flex-1">
                <SelectClient
                  options={attribiteSelect}
                  className="grow w-full"
                  placeholder="Thuộc tính"
                  onChange={(val) => {
                    if (!val) return;
                    handleAttribute(val);
                  }}
                />
                {arrErr.attribute && (
                  <span className={clsx("err--form")}>{arrErr.attribute}</span>
                )}
              </div>
            </div>
            {attributes && attributes.length > 0 && (
              <div className="attribute--list flex flex-col gap-y-4">
                {attributes.map((item) => (
                  <div className="item flex-y-center gap-x-3">
                    <label
                      htmlFor=""
                      className="text-sm text-accentColor w-[130px]"
                    >
                      {item.label}
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        className="style-inp-1 w-full"
                        onChange={(e) =>
                          handleValidatorAttribute(item.id, e.target.value)
                        }
                      />
                      {item.error && (
                        <span className={clsx("err--form")}>{item.error}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/*  */}
          {/* block form group */}
          <div className="form--group bg-white p-3 rounded-sm">
            <div className="block--titleAction flex-between-center">
              <div className="title text-sm text-neutral-700 ">Biến thể</div>
              <BtnSecondary
                content="Thêm biến thể"
                onClick={handleAddVariant}
              />
              {/* <button>Thêm biến thể</button> */}
            </div>
            {/* {variants &&
                variants.length > 0 &&
                variants.map((item) => (
                    
                ))} */}
            {variants && variants.length > 0 && (
              <div className="variant--list mt-4 flex flex-col gap-y-5">
                {variants.map((item) => (
                  <div
                    key={item.id}
                    className="block--vartiant relative bg-neutral-50 p-3"
                  >
                    <div className="action">
                      <label
                        htmlFor=""
                        className="text-sm text-accentColor w-[130px] font-medium"
                      >
                        Màu sắc:
                      </label>
                      <button
                        className="remove absolute -right-1 -top-1 flex-center w-4.5 h-4.5 rounded-full bg-accentColor/70 text-lg text-white hover:bg-accentColor transition-all-300-ease"
                        onClick={() => handleRemoveVariant(item.id)}
                      >
                        <IoIosClose />
                      </button>
                    </div>
                    <div className="wrap--variant flex flex-col gap-y-3 mt-2">
                      <div className="group--block flex-y-center gap-x-3">
                        <label
                          htmlFor=""
                          className="text-sm text-neutral-700 w-[130px]"
                        >
                          Tên biến thể
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="style-inp-1 w-full"
                            onChange={(e) =>
                              handleValidatorVariantAll(
                                item.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          {item.err.name && (
                            <span className={clsx("err--form")}>
                              {item.err.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="group--block flex-y-center gap-x-3">
                        <label
                          htmlFor=""
                          className="text-sm text-neutral-700 w-[130px]"
                        >
                          Code
                          {/* <span className="text-red-600">*</span> */}
                        </label>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="style-inp-1 w-full"
                            onChange={(e) =>
                              handleValidatorVariantAll(
                                item.id,
                                "code",
                                e.target.value
                              )
                            }
                          />
                          {item.err.code && (
                            <span className={clsx("err--form")}>
                              {item.err.code}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="group--block flex-y-center gap-x-3">
                        <label
                          htmlFor=""
                          className="text-sm text-neutral-700 w-[130px]"
                        >
                          Giá
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="style-inp-1 w-full"
                            onChange={(e) =>
                              handleValidatorVariantAll(
                                item.id,
                                "price",
                                e.target.value
                              )
                            }
                          />
                          {item.err.price && (
                            <span className={clsx("err--form")}>
                              {item.err.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="group--block flex-y-center gap-x-3">
                        <label
                          htmlFor=""
                          className="text-sm text-neutral-700 w-[130px]"
                        >
                          Số lượng
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="flex-1">
                          <input
                            type="number"
                            className="style-inp-1 w-full"
                            min={1}
                            defaultValue={1}
                            onChange={(e) =>
                              handleValidatorVariantAll(
                                item.id,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                          {item.err.quantity && (
                            <span className={clsx("err--form")}>
                              {item.err.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="wrap--previewAddImg flex-y-center gap-x-3">
                        {item && item.hinh_bien_the && (
                          <div
                            ref={fancyboxRef}
                            className="imgPreview--list flex-y-center gap-x-3"
                          >
                            {/* {hinh_bien_the.map((img, i) => (
                              
                            ))} */}
                            <div className="block--imgPreview relative">
                              <button
                                className="remove flex-center w-3.5 h-3.5 rounded-full bg-accentColor/70 absolute -right-1 -top-1 z-10 text-base text-white hover:bg-accentColor transition-all-300-ease"
                                onClick={() => handleCloseImgVariant(item.id)}
                              >
                                <IoIosClose />
                              </button>
                              <a
                                href={URL.createObjectURL(item.hinh_bien_the)}
                                data-fancybox="previewImgProduce"
                                className="img--preview inline-block w-20 h-20 rounded-md overflow-hidden"
                              >
                                <ImgLazy
                                  src={URL.createObjectURL(item.hinh_bien_the)}
                                  alt={""}
                                  wrapperClassName="inline-block w-full h-full"
                                  className="img-full"
                                />
                              </a>
                            </div>
                          </div>
                        )}
                        <div className="block--inp ">
                          <div className="block--choseImg relative flex-center w-20 h-20 overflow-hidden rounded-md border border-dashed border-accentColor cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              //   onChange={handleFileChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) =>
                                handleValidatorVariantAll(
                                  item.id,
                                  "hinh_bien_the",
                                  e.target.files?.[0]
                                )
                              }
                            />
                            <span className="content text-xs text-accentColor">
                              Thêm ảnh
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* block form group */}
          <div className="form--group flex flex-col gap-y-3 bg-white p-3 rounded-sm">
            <label htmlFor="" className="text-sm text-neutral-700 w-[130px]">
              Mô tả
              <span className="text-red-600">*</span>
            </label>
            <div className="group--block ">
              <textarea
                name=""
                id=""
                className="w-full min-h-[180px] border border-neutral-200 rounded-md outline-none py-2 px-3"
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </div>
          </div>
          {/*  */}
          {/*  */}

          <div className="wrap--btn">
            <BtnPrimary
              content="Thêm sản phẩm"
              onClick={handleAddproductSeller}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
