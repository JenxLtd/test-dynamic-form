import { createEffect, For, type Component } from 'solid-js';
import { createForm } from '@tanstack/solid-form';
import { Section } from './components/Section';

const App: Component = () => {
  const rawSections = [
    {
      id: "1",
      name: "Foo",
      parentSection: null,
      linkedSection: null,
      linkedSectionValue: null,
      type: "Section",
    },
    {
      id: "2",
      name: "Bar",
      parentSection: "1",
      linkedSection: null,
      linkedSectionValue: null,
      type: "Options",
      options: ["1", "2", "3"],
    },
    {
      id: "3",
      name: "Baz",
      parentSection: "1",
      linkedSection: "2",
      linkedSectionValue: "2",
      type: "Section",
    },
    {
      id: "4",
      name: "Chocolate",
      parentSection: "3",
      linkedSection: "2",
      linkedSectionValue: "2",
      type: "Options",
      options: ["1", "2", "3"],
    },
  ]

  const form = createForm(() => ({
    onSubmit: (state) => {
      console.log(state)
    }
  }))

  window.form = form

  const sections = form.useStore(state => {
    const tree = buildTree(rawSections, state.values)
    console.log(tree)
    return tree
  })

  // createEffect(() => console.log(sections()))

  return (
    <>
      <h1>Example</h1>
      <For each={sections()}>
        {section => <Section form={form} {...section} />}
      </For>
    </>
  );
};

export default App;

function buildTree(
  sections: any,
  state: any,
  parentId: number | null = null,
): any {
  return sections
    .filter(
      (s) =>
        s.parentSection === parentId &&
        (s.linkedSection === null || s.linkedSectionValue === state[s.linkedSection])
    )
    .map((s) => {
      const children = buildTree(sections, state, s.id);

      return {
        id: s.id,
        name: s.name,
        type: s.type || (s.options ? "Options" : "Section"),
        ...(s.options ? { options: s.options } : {}),
        ...(children.length ? { children } : {}),
      };
    });
}