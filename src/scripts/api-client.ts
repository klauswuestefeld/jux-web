
export const getMXData = async (domainName: string): Promise<any> => {
  const records = await fetch
    (
      `https://dns.google.com/resolve?name=${domainName}&type=MX`,
      {
        method: 'GET',
        mode: 'cors'
      }
    );
  const recordsJson = await records.json();
  const answer = recordsJson.Answer;

  if (!answer) {
    return null;
  }

  const data = Array.from(answer).map((a: any) => a.data);

  return data;
};
