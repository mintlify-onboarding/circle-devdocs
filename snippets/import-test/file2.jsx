import { ChildComponent } from "snippets/import-test/file1.jsx";

export const ParentComponent = () => {
  return (
    <div className="p-5 border-2 border-green-500 rounded">
      <h2 className="text-xl font-bold text-green-600 mb-2">This is the Parent Component</h2>
      <p className="text-gray-700 mb-4">I contain a child component below:</p>
      <ChildComponent />
    </div>
  );
};
