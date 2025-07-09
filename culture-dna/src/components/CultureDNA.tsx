// // components/CultureDNA.tsx
// import React from "react";

// export function CultureDNA({ dna }: { dna: any[] }) {
//   return (
//     <div>
//       <h2 className="text-xl font-semibold">Cultural DNA Tags</h2>
//       <ul className="grid grid-cols-2 gap-2 mt-2">
//         {dna.map((tag) => (
//           <li
//             key={tag.tag_id}
//             className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm"
//           >
//             {tag.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// components/CultureDNA.tsx
import React from "react";

export function CultureDNA({ dna }: { dna: any[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Cultural DNA Tags</h2>
      <ul className="grid grid-cols-2 gap-2 mt-2">
        {dna.map((tag) => (
          <li
            key={tag.tag_id}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm"
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
