const Title = "Экран";
const Link = "Ссылка";

export function* screenBlockGen(count: number) {
  for (let i = 0; i < count; i++) {
    yield {
      id: i,
      title: `${Title} ${i}`,
      link: `${Link} ${i}`,
    };
  }
}
