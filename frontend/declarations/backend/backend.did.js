export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addWord' : IDL.Func([IDL.Text], [], []),
    'getWordCloud' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'init' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
