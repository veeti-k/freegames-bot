import { ILanguageWithGuildCount } from "shared";
import { request } from ".";
import { IAddLanguageValues, IUpdateLanguageValues } from "../validation/Languages";
import toast from "react-hot-toast";

export const addLanguage = async (
  values: IAddLanguageValues,
  currentLanguages?: ILanguageWithGuildCount[]
): Promise<ILanguageWithGuildCount[]> =>
  toast.promise(
    (async () => {
      const addedLang = await request<ILanguageWithGuildCount>({
        path: "/languages",
        method: "POST",
        body: values,
      });

      const filtered = currentLanguages?.filter((l) => l.code !== values.code) || [];
      return [...filtered, addedLang];
    })(),
    {
      loading: "Adding language",
      success: "Language added",
      error: "Failed to add language",
    }
  );

export const updateLanguage = async (
  code: string,
  values: IUpdateLanguageValues,
  currentLanguages?: ILanguageWithGuildCount[]
): Promise<ILanguageWithGuildCount[]> =>
  toast.promise(
    (async () => {
      const updatedLang = await request<ILanguageWithGuildCount>({
        path: `/languages/${code}`,
        method: "PATCH",
        body: values,
      });

      const filtered = currentLanguages?.filter((l) => l.code !== code) || [];
      return [...filtered, updatedLang];
    })(),
    {
      loading: "Updating language",
      success: "Language updated",
      error: "Failed to update language",
    }
  );

export const updateTranslations = async () =>
  toast.promise(
    request({
      path: "/languages/update",
      method: "POST",
    }),
    {
      loading: "Updating translations",
      success: "Translations updated",
      error: "Failed to update translations",
    }
  );
