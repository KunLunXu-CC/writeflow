/**
 * 将文件读取为 Data URL
 * @param {File} file - 要读取的文件对象
 * @return {Promise<string | ArrayBuffer | null>} - 读取结果的 Promise
 */
export const readFileAsDataURL = (file: File) => {
  const promise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return promise;
};

/**
 * 过滤出图片文件
 * @param {FileList | undefined} files - 要过滤的文件列表
 * @return {File[]} - 过滤后的图片文件数组
 */

export const filterImageFiles = (files?: FileList): File[] => {
  if (!files) {
    return [];
  }

  const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

  return imageFiles;
};
